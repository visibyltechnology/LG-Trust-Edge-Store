import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "LG Trust Edge: #1 Electronics Showroom in Ikorodu & Nigeria", 
  description = "Shop premium authentic TVs, ACs, refrigerators & home appliances at LG Trust Edge Showroom in Ikorodu. Fast delivery across Lagos and Nigeria.", 
  name = "LG Trust Edge", 
  type = "website",
  image = "https://www.lgtrustedge.com.ng/logo.png",
  url = ""
}) {
  // Use the provided url or fall back to the current window location (useful for SSR or client-side routing)
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : "https://www.lgtrustedge.com.ng/");

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical URL - Fixes Google Search Console URL conflicts */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph tags for Social Media / WhatsApp sharing */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={name} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
