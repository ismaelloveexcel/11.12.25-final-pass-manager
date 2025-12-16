# Azure Deployment Migration Checklist

Quick reference checklist for deploying the Pass Manager to Azure.

---

## ⚡ Quick Deployment (5-10 minutes)

### Phase 1: Prerequisites ✅
- [ ] Azure CLI installed (`az --version`)
- [ ] Logged into Azure (`az login`)
- [ ] GitHub repository access
- [ ] Git installed and configured

### Phase 2: Provision Azure Resources (~2 min)
- [ ] Run `.azure/provision.sh`
- [ ] Note the deployment token from output
- [ ] Note the Static Web App URL

### Phase 3: Configure GitHub (~1 min)
- [ ] Go to repository Settings → Secrets → Actions
- [ ] Add secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- [ ] Paste the deployment token value

### Phase 4: Deploy (~2 min)
- [ ] Push to main branch: `git push origin main`
- [ ] Check GitHub Actions for deployment status
- [ ] Verify app is live at Azure URL

---

## 📋 Detailed Checklist

### Prerequisites

| Task | Command/Action | Status |
|------|----------------|--------|
| Install Azure CLI | [docs.microsoft.com/cli/azure/install-azure-cli](https://docs.microsoft.com/cli/azure/install-azure-cli) | ☐ |
| Azure login | `az login` | ☐ |
| Verify subscription | `az account show` | ☐ |
| GitHub admin access | Check Settings page | ☐ |

### Azure Provisioning

| Task | Command/Action | Status |
|------|----------------|--------|
| Make script executable | `chmod +x .azure/provision.sh` | ☐ |
| Run provision script | `./.azure/provision.sh` | ☐ |
| Copy deployment token | From script output | ☐ |
| Note Static Web App URL | From script output | ☐ |

### GitHub Configuration

| Task | Location | Status |
|------|----------|--------|
| Navigate to Secrets | Settings → Secrets → Actions | ☐ |
| Add `AZURE_STATIC_WEB_APPS_API_TOKEN` | New repository secret | ☐ |

### Deployment Verification

| Task | How to Verify | Status |
|------|---------------|--------|
| GitHub Actions running | Actions tab → green checkmark | ☐ |
| App accessible | Visit Azure Static Web App URL | ☐ |
| HTTPS working | URL starts with `https://` | ☐ |
| All features working | Test app functionality | ☐ |

---

## 🔧 Optional Enhancements

### Custom Domain
- [ ] Choose domain name
- [ ] Configure DNS CNAME record
- [ ] Add domain in Azure Portal
- [ ] Wait for SSL certificate provisioning
- [ ] Verify custom domain works

### Monitoring
- [ ] Enable Azure Monitor (if needed)
- [ ] Set up alerts for failures
- [ ] Configure logging

---

## 🆘 Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Script permission denied | `chmod +x .azure/provision.sh` |
| Azure login required | `az login` |
| GitHub Actions fails | Check token is correct in secrets |
| App not loading | Verify deployment completed in Actions |
| Custom domain not working | Check DNS propagation |

---

## ✅ Post-Deployment Verification

Test these features after deployment:

- [ ] Homepage loads correctly
- [ ] Candidate cards display
- [ ] AI Assistant modal opens
- [ ] Pass generation works
- [ ] Stage navigation works
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive layout

---

## 📝 Notes

Write any deployment-specific notes here:

```
Date: _______________
Deployed by: _______________
Static Web App URL: _______________
Notes: _______________
```

---

**Reference:** See `DEPLOYMENT_GUIDE.md` for detailed instructions.
