targetScope = 'resourceGroup'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Name of the resource group. Generated from environmentName if not provided.')
param resourceGroupName string = ''

// Environment variables for the app
@secure()
param bingApiKey string = ''

@secure()
param openaiApiKey string = ''

@secure()
param openWeatherMapApiKey string = ''

@secure()
param alphaVantageApiKey string = ''

@secure()
param finnhubApiKey string = ''

@secure()
param stripeSecretKey string = ''

param stripePublishableKey string = ''

param firebaseApiKey string = ''
param firebaseAuthDomain string = ''
param firebaseProjectId string = ''
param firebaseStorageBucket string = ''
param firebaseMessagingSenderId string = ''
param firebaseAppId string = ''
param firebaseMeasurementId string = ''

// Generate a unique token for resource naming
var resourceToken = uniqueString(subscription().id, resourceGroup().id, location, environmentName)
var resourcePrefix = 'omx'

// Resource names using the resourceToken
var appServicePlanName = 'asp-${resourcePrefix}-${resourceToken}'
var appServiceName = 'app-${resourcePrefix}-${resourceToken}'
var logAnalyticsName = 'log-${resourcePrefix}-${resourceToken}'
var appInsightsName = 'ai-${resourcePrefix}-${resourceToken}'
var managedIdentityName = 'id-${resourcePrefix}-${resourceToken}'

// Create user-assigned managed identity
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: managedIdentityName
  location: location
  tags: {
    'azd-service-name': 'omniplex-web'
  }
}

// Create Log Analytics workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
  tags: {
    'azd-service-name': 'omniplex-web'
  }
}

// Create Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
  tags: {
    'azd-service-name': 'omniplex-web'
  }
}

// Create App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  properties: {
    reserved: false // Windows
  }
  tags: {
    'azd-service-name': 'omniplex-web'
  }
}

// Create App Service
resource appService 'Microsoft.Web/sites@2024-04-01' = {
  name: appServiceName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      alwaysOn: false
      cors: {
        allowedOrigins: ['*']
        supportCredentials: false
      }
      appSettings: [
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'BING_API_KEY'
          value: bingApiKey
        }
        {
          name: 'OPENAI_API_KEY'
          value: openaiApiKey
        }
        {
          name: 'OPENWEATHERMAP_API_KEY'
          value: openWeatherMapApiKey
        }
        {
          name: 'ALPHA_VANTAGE_API_KEY'
          value: alphaVantageApiKey
        }
        {
          name: 'FINNHUB_API_KEY'
          value: finnhubApiKey
        }
        {
          name: 'STRIPE_SECRET_KEY'
          value: stripeSecretKey
        }
        {
          name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
          value: stripePublishableKey
        }
        {
          name: 'NEXT_PUBLIC_FIREBASE_API_KEY'
          value: firebaseApiKey
        }
        {
          name: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
          value: firebaseAuthDomain
        }
        {
          name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
          value: firebaseProjectId
        }
        {
          name: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
          value: firebaseStorageBucket
        }
        {
          name: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
          value: firebaseMessagingSenderId
        }
        {
          name: 'NEXT_PUBLIC_FIREBASE_APP_ID'
          value: firebaseAppId
        }
        {
          name: 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
          value: firebaseMeasurementId
        }
      ]
    }
  }
  tags: {
    'azd-service-name': 'omniplex-web'
  }
}

// Create diagnostic settings for App Service
resource appServiceDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  scope: appService
  name: '${appServiceName}-diagnostics'
  properties: {
    workspaceId: logAnalytics.id
    logs: [
      {
        categoryGroup: 'allLogs'
        enabled: true
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
    ]
  }
}

// Outputs
output RESOURCE_GROUP_ID string = resourceGroup().id
output APPLICATIONINSIGHTS_CONNECTION_STRING string = appInsights.properties.ConnectionString
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output SERVICE_OMNIPLEX_WEB_IDENTITY_PRINCIPAL_ID string = managedIdentity.properties.principalId
output SERVICE_OMNIPLEX_WEB_NAME string = appService.name
output SERVICE_OMNIPLEX_WEB_URI string = 'https://${appService.properties.defaultHostName}'
