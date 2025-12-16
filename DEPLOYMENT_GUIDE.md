# Azure Deployment Guide - Pass Manager

This guide provides step-by-step instructions for deploying the Pass Manager HR Screening application to Azure.

## 📦 Architecture Overview

The Pass Manager is deployed as a **static web application** using Azure Static Web Apps:

```
┌─────────────────────────────────────────────────────┐
│                   Azure Cloud                        │
├─────────────────────────────────────────────────────┤
│                                                       │
│         ┌────────────────────────────────┐           │
│         │   Azure Static Web Apps        │           │
│         │   (Pass Manager Frontend)      │           │
│         │                                │           │
│         │   📄 index.html                │           │
│         │   ├── CSS (embedded)           │           │
│         │   ├── JavaScript (embedded)    │           │
│         │   └── Bootstrap CDN            │           │
│         │                                │           │
│         │   Free Tier: $0/month          │           │
│         │   ✓ Global CDN                 │           │
│         │   ✓ Automatic HTTPS            │           │
│         │   ✓ Custom domains             │           │
│         └────────────────────────────────┘           │
│                                                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                GitHub (CI/CD)                        │
├─────────────────────────────────────────────────────┤
│                                                       │
│   Push to main  →  GitHub Actions  →  Deploy        │
│                                                       │
│   ✅ Automatic deployment on push                    │
│   ✅ Preview environments for PRs                    │
│   ✅ Zero-downtime updates                           │
│                                                       │
└─────────────────────────────────────────────────────┘
```

## 🚀 Quick Start (3 Steps)

### Step 1: Provision Azure Resources

Run the provisioning script to create Azure resources:

```bash
# Make the script executable
chmod +x .azure/provision.sh

# Run the provisioning script
./.azure/provision.sh
```

**What this creates:**
- Resource group in Azure
- Azure Static Web App (Free tier)
- Deployment token for GitHub Actions

**Time required:** ~2 minutes

### Step 2: Configure GitHub Secrets

After running the provisioning script, add the deployment token to GitHub:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:

| Name | Value |
|------|-------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | (Token from provision script output) |

**Time required:** ~1 minute

### Step 3: Deploy

Push to the main branch to trigger deployment:

```bash
git push origin main
```

The GitHub Actions workflow will automatically:
1. Detect the push
2. Deploy to Azure Static Web Apps
3. Make the app available at your Azure URL

**Time required:** ~1-2 minutes

## 📋 Prerequisites

Before starting, ensure you have:

### Azure Requirements
- [ ] Active Azure subscription
- [ ] Azure CLI installed ([Installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli))
- [ ] Logged in via Azure CLI (`az login`)

### GitHub Requirements
- [ ] Repository admin access (to add secrets)
- [ ] GitHub Actions enabled

### Verify Azure CLI Installation

```bash
# Check if Azure CLI is installed
az --version

# Login to Azure (if not already)
az login

# Verify subscription
az account show
```

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy manually or the script fails:

### Create Resource Group

```bash
az group create \
  --name rg-passmanager-portal \
  --location uaenorth
```

### Create Static Web App

```bash
az staticwebapp create \
  --name passmanager-portal-frontend \
  --resource-group rg-passmanager-portal \
  --location uaenorth \
  --sku Free
```

### Get Deployment Token

```bash
az staticwebapp secrets list \
  --name passmanager-portal-frontend \
  --resource-group rg-passmanager-portal \
  --query "properties.apiKey" \
  -o tsv
```

## 🌐 Custom Domain Setup

To use a custom domain:

1. **Azure Portal:**
   - Navigate to your Static Web App
   - Go to **Custom domains**
   - Click **Add**

2. **DNS Configuration:**
   - Add a CNAME record pointing to your Azure Static Web App URL
   - Or add a TXT record for validation

3. **SSL Certificate:**
   - Azure automatically provisions and manages SSL certificates

```bash
# Add custom domain via CLI
az staticwebapp hostname set \
  --name passmanager-portal-frontend \
  --resource-group rg-passmanager-portal \
  --hostname www.yourdomain.com
```

## 💰 Cost Estimate

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Azure Static Web Apps | Free | $0 |
| **Total** | | **$0/month** |

The Free tier includes:
- 100 GB bandwidth per subscription
- 2 custom domains
- Free SSL certificates
- Staging environments for PRs

## 🔒 Security Features

### Built-in Security
- ✅ **HTTPS only** - Automatic SSL/TLS certificates
- ✅ **Global CDN** - Content delivered from edge locations
- ✅ **DDoS protection** - Basic protection included
- ✅ **Staging environments** - PRs deploy to isolated URLs

### Best Practices
- Never commit secrets to the repository
- Use GitHub Secrets for sensitive values
- Regularly rotate deployment tokens

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy-frontend.yml`) provides:

### On Push to Main
1. Checks out code
2. Deploys to Azure Static Web Apps
3. Updates production environment

### On Pull Request
1. Creates a staging environment
2. Provides preview URL in PR comments
3. Cleans up when PR is closed

### Monitoring Deployments
- View workflow runs: **Repository** → **Actions**
- Check deployment status in Azure Portal
- Review deployment logs in GitHub Actions

## 🆘 Troubleshooting

### Common Issues

#### Deployment Fails with "Token Invalid"
```
Error: The deployment token is invalid or expired
```
**Solution:** Regenerate the token and update the GitHub secret:
```bash
az staticwebapp secrets list \
  --name passmanager-portal-frontend \
  --resource-group rg-passmanager-portal \
  --query "properties.apiKey" -o tsv
```

#### Static Web App Not Found
```
Error: Resource not found
```
**Solution:** Verify the resource exists:
```bash
az staticwebapp list --resource-group rg-passmanager-portal
```

#### Permission Denied Running Script
```
Permission denied: .azure/provision.sh
```
**Solution:** Make the script executable:
```bash
chmod +x .azure/provision.sh
```

### Viewing Logs

```bash
# View recent deployments
az staticwebapp show \
  --name passmanager-portal-frontend \
  --resource-group rg-passmanager-portal
```

### Getting Help
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)

## 🧹 Cleanup

To remove all Azure resources:

```bash
# Using the provision script
./.azure/provision.sh cleanup

# Or manually
az group delete --name rg-passmanager-portal --yes
```

⚠️ **Warning:** This permanently deletes all resources in the resource group.

## 📚 Additional Resources

| Resource | Link |
|----------|------|
| Azure Static Web Apps | https://azure.microsoft.com/services/app-service/static/ |
| GitHub Actions | https://github.com/features/actions |
| Azure CLI | https://docs.microsoft.com/cli/azure/ |
| Azure Portal | https://portal.azure.com |

---

## ✅ Deployment Checklist

Use this checklist to verify your deployment:

- [ ] Azure CLI installed and logged in
- [ ] Provisioning script executed successfully
- [ ] GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN` added
- [ ] GitHub Actions workflow shows green checkmark
- [ ] Application accessible at Azure Static Web Apps URL
- [ ] HTTPS working correctly
- [ ] (Optional) Custom domain configured

---

**🎉 Congratulations!** Your Pass Manager application is now deployed to Azure!
