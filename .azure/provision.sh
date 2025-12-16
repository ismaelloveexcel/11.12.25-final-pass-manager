#!/bin/bash

# ============================================
# Azure Static Web App Provisioning Script
# Pass Manager - HR Screening Application
# ============================================
#
# This script provisions Azure resources for the
# Pass Manager static web application.
#
# Prerequisites:
# - Azure CLI installed and logged in (az login)
# - Bash shell environment
#
# Usage:
#   chmod +x .azure/provision.sh
#   ./.azure/provision.sh
#
# ============================================

set -e  # Exit on error

# ============================================
# CONFIGURATION - Customize these values
# ============================================

# Application name (used as prefix for all resources)
APP_NAME="${APP_NAME:-passmanager-portal}"

# Azure region (UAE North for UAE-based deployments)
LOCATION="${LOCATION:-uaenorth}"

# Resource group name
RESOURCE_GROUP="${RESOURCE_GROUP:-rg-${APP_NAME}}"

# Static Web App settings
STATIC_WEB_APP_NAME="${STATIC_WEB_APP_NAME:-${APP_NAME}-frontend}"
STATIC_WEB_APP_SKU="${STATIC_WEB_APP_SKU:-Free}"

# GitHub repository info (for deployment token)
GITHUB_REPO="${GITHUB_REPO:-}"  # Optional: owner/repo format

# ============================================
# COLORS FOR OUTPUT
# ============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# HELPER FUNCTIONS
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_section() {
    echo ""
    echo "============================================"
    echo -e "${BLUE}$1${NC}"
    echo "============================================"
}

check_azure_cli() {
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed. Please install it first."
        log_info "Installation guide: https://docs.microsoft.com/cli/azure/install-azure-cli"
        exit 1
    fi
}

check_azure_login() {
    if ! az account show &> /dev/null; then
        log_error "You are not logged into Azure CLI. Please run 'az login' first."
        exit 1
    fi
}

# ============================================
# MAIN PROVISIONING SCRIPT
# ============================================

main() {
    print_section "🚀 Pass Manager - Azure Provisioning"
    
    log_info "Starting Azure resource provisioning..."
    log_info "App Name: $APP_NAME"
    log_info "Location: $LOCATION"
    log_info "Resource Group: $RESOURCE_GROUP"
    
    # Pre-flight checks
    print_section "📋 Pre-flight Checks"
    check_azure_cli
    log_success "Azure CLI is installed"
    check_azure_login
    log_success "Azure CLI is logged in"
    
    # Show current subscription
    SUBSCRIPTION=$(az account show --query name -o tsv)
    log_info "Using subscription: $SUBSCRIPTION"
    
    # ============================================
    # STEP 1: Create Resource Group
    # ============================================
    print_section "📦 Step 1: Creating Resource Group"
    
    if az group show --name "$RESOURCE_GROUP" &> /dev/null; then
        log_warning "Resource group '$RESOURCE_GROUP' already exists. Skipping creation."
    else
        log_info "Creating resource group '$RESOURCE_GROUP' in '$LOCATION'..."
        az group create \
            --name "$RESOURCE_GROUP" \
            --location "$LOCATION" \
            --tags "Project=$APP_NAME" "Environment=Production" "CreatedBy=provision-script"
        log_success "Resource group created successfully"
    fi
    
    # ============================================
    # STEP 2: Create Azure Static Web App
    # ============================================
    print_section "🌐 Step 2: Creating Azure Static Web App"
    
    if az staticwebapp show --name "$STATIC_WEB_APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null 2>&1; then
        log_warning "Static Web App '$STATIC_WEB_APP_NAME' already exists. Skipping creation."
    else
        log_info "Creating Static Web App '$STATIC_WEB_APP_NAME'..."
        log_info "SKU: $STATIC_WEB_APP_SKU (Free tier = $0/month)"
        
        az staticwebapp create \
            --name "$STATIC_WEB_APP_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --location "$LOCATION" \
            --sku "$STATIC_WEB_APP_SKU" \
            --tags "Project=$APP_NAME" "Environment=Production"
        
        log_success "Static Web App created successfully"
    fi
    
    # ============================================
    # STEP 3: Get Deployment Token
    # ============================================
    print_section "🔑 Step 3: Getting Deployment Token"
    
    log_info "Retrieving deployment token for GitHub Actions..."
    DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
        --name "$STATIC_WEB_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query "properties.apiKey" \
        -o tsv)
    
    if [ -z "$DEPLOYMENT_TOKEN" ]; then
        log_error "Failed to retrieve deployment token"
        exit 1
    fi
    
    log_success "Deployment token retrieved successfully"
    
    # ============================================
    # STEP 4: Get Static Web App URL
    # ============================================
    print_section "🔗 Step 4: Getting Application URL"
    
    STATIC_WEB_APP_URL=$(az staticwebapp show \
        --name "$STATIC_WEB_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query "defaultHostname" \
        -o tsv)
    
    log_success "Application URL: https://$STATIC_WEB_APP_URL"
    
    # ============================================
    # SUMMARY & NEXT STEPS
    # ============================================
    print_section "✅ Provisioning Complete!"
    
    echo ""
    echo "============================================"
    echo -e "${GREEN}📋 DEPLOYMENT SUMMARY${NC}"
    echo "============================================"
    echo ""
    echo "Resource Group:     $RESOURCE_GROUP"
    echo "Static Web App:     $STATIC_WEB_APP_NAME"
    echo "SKU:                $STATIC_WEB_APP_SKU (Free)"
    echo "Location:           $LOCATION"
    echo ""
    echo "Application URL:    https://$STATIC_WEB_APP_URL"
    echo ""
    echo "============================================"
    echo -e "${YELLOW}🔐 GITHUB SECRET TO ADD${NC}"
    echo "============================================"
    echo ""
    echo "Add the following secret to your GitHub repository:"
    echo ""
    echo "  Secret Name:  AZURE_STATIC_WEB_APPS_API_TOKEN"
    echo "  Secret Value: $DEPLOYMENT_TOKEN"
    echo ""
    echo "To add this secret:"
    echo "  1. Go to: https://github.com/<owner>/<repo>/settings/secrets/actions"
    echo "  2. Click 'New repository secret'"
    echo "  3. Name: AZURE_STATIC_WEB_APPS_API_TOKEN"
    echo "  4. Paste the token value above"
    echo ""
    echo "============================================"
    echo -e "${BLUE}📝 NEXT STEPS${NC}"
    echo "============================================"
    echo ""
    echo "1. Add the GitHub secret (shown above)"
    echo "2. Push to 'main' branch to trigger deployment"
    echo "3. View deployment at: https://$STATIC_WEB_APP_URL"
    echo ""
    echo "For detailed instructions, see: DEPLOYMENT_GUIDE.md"
    echo ""
    echo "============================================"
    echo -e "${GREEN}🎉 Provisioning completed successfully!${NC}"
    echo "============================================"
    
    # Save outputs to file for reference
    OUTPUT_FILE=".azure/provision-output.txt"
    cat > "$OUTPUT_FILE" << EOF
# Azure Provisioning Output
# Generated: $(date)

RESOURCE_GROUP=$RESOURCE_GROUP
STATIC_WEB_APP_NAME=$STATIC_WEB_APP_NAME
STATIC_WEB_APP_URL=https://$STATIC_WEB_APP_URL
LOCATION=$LOCATION

# GitHub Secret (DO NOT COMMIT THIS FILE!)
# AZURE_STATIC_WEB_APPS_API_TOKEN=$DEPLOYMENT_TOKEN
EOF

    log_info "Outputs saved to: $OUTPUT_FILE"
    log_warning "Note: The output file contains sensitive data. Do not commit it to version control."
    
    # Add to .gitignore if not already present
    if ! grep -q "provision-output.txt" ".gitignore" 2>/dev/null; then
        echo ".azure/provision-output.txt" >> ".gitignore"
        log_info "Added provision-output.txt to .gitignore"
    fi
}

# ============================================
# CLEANUP FUNCTION (Optional)
# ============================================

cleanup() {
    print_section "🗑️ Cleanup Resources"
    
    read -p "Are you sure you want to delete all resources? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        log_info "Deleting resource group '$RESOURCE_GROUP' and all resources..."
        az group delete --name "$RESOURCE_GROUP" --yes --no-wait
        log_success "Resource group deletion initiated (may take a few minutes)"
    else
        log_info "Cleanup cancelled"
    fi
}

# ============================================
# SCRIPT ENTRY POINT
# ============================================

case "${1:-}" in
    cleanup|--cleanup|-c)
        cleanup
        ;;
    help|--help|-h)
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (default)    Provision Azure resources"
        echo "  cleanup      Delete all provisioned resources"
        echo "  help         Show this help message"
        echo ""
        echo "Environment Variables:"
        echo "  APP_NAME           Application name prefix (default: passmanager-portal)"
        echo "  LOCATION           Azure region (default: uaenorth)"
        echo "  RESOURCE_GROUP     Resource group name (default: rg-\$APP_NAME)"
        echo ""
        ;;
    *)
        main
        ;;
esac
