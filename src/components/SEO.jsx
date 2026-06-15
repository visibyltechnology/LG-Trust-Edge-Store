import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "LG Trust Edge: #1 Online Electronics Store in Nigeria", 
  description = "Shop premium authentic TVs, ACs, refrigerators & home appliances at LG Trust Edge. Fast delivery across Lagos and Nigeria. Buy electronics online today!", 
  name = "LG Trust Edge", 
  type = "website",
  image = "https://www.lgtrustedge.com.ng/logo.png",
  url = "https://www.lgtrustedge.com.ng/"
}) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph tags for Social Media / WhatsApp sharing */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
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
