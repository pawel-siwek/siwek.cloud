// Monthly cost budget for the subscription that hosts siwek.cloud.
// The Free plan costs nothing, so any alert means something changed (a plan upgrade, a stray resource).
// A budget only alerts; it never stops resources.
//
//   az deployment sub create -l westeurope -f infra/budget.bicep -p contactEmails='["you@example.com"]'

targetScope = 'subscription'

@description('Budget per month, in the billing currency of the subscription.')
param amount int = 1

@description('Who gets the alerts. Kept out of the repo on purpose.')
param contactEmails array

@description('First day of the month the budget starts. Defaults to the current month.')
param startDate string = '${utcNow('yyyy-MM')}-01'

resource budget 'Microsoft.Consumption/budgets@2023-11-01' = {
  name: 'siwek-cloud-monthly'
  properties: {
    category: 'Cost'
    amount: amount
    timeGrain: 'Monthly'
    timePeriod: {
      startDate: startDate
    }
    notifications: {
      anySpend: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 1
        thresholdType: 'Actual'
        contactEmails: contactEmails
      }
      forecastOverBudget: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 100
        thresholdType: 'Forecasted'
        contactEmails: contactEmails
      }
    }
  }
}
