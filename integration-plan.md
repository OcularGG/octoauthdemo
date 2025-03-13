# Integration Approach

yourdomain.com          -> Your existing site (current OCULAR site)
yourdomain.com/shop     -> Fourthwall storefront

## Integration Options:

1. **Subdirectory Deployment**: 
   - Deploy the storefront in a separate Netlify site
   - Configure proxying via Netlify redirects

2. **Monorepo Approach**:
   - Combine both sites in a single repository
   - Configure build settings for both
