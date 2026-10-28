// Azure Static Web App for siwek.cloud.
// Free plan, no linked repository: GitHub Actions deploys with the app's deployment token,
// so Azure never needs access to the GitHub repo.
//
//   az deployment group create -g rg-siwek-cloud -f infra/swa.bicep

@description('Static Web App name.')
param name string = 'swa-siwek-cloud'

@description('Region of the management plane. Static content is distributed globally either way.')
@allowed([
  'westeurope'
  'westus2'
  'centralus'
  'eastus2'
  'eastasia'
])
param location string = 'westeurope'

resource site 'Microsoft.Web/staticSites@2024-04-01' = {
  name: name
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
  }
  tags: {
    workload: 'siwek.cloud'
  }
}

@description('Default hostname: the CNAME target for the custom domain.')
output defaultHostname string = site.properties.defaultHostname
