import React from "react"
import { oneLine, stripIndent } from "common-tags"

exports.onRenderBody = (
  { setHeadComponents, setPreBodyComponents },
  pluginOptions
) => {
  if (
    process.env.NODE_ENV === `production` ||
    pluginOptions.includeInDevelopment
  ) {
    const environmentParamStr =
      pluginOptions.gtmAuth && pluginOptions.gtmPreview
        ? oneLine`
      &gtm_auth=${pluginOptions.gtmAuth}&gtm_preview=${
            pluginOptions.gtmPreview
          }&gtm_cookies_win=x
    `
        : ``

    setHeadComponents([
      <script
        key="plugin-google-tagmanager"
        dangerouslySetInnerHTML={{
          __html: stripIndent`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl+'${environmentParamStr}';f.parentNode.insertBefore(j,f);
            })(window,document,'script','${pluginOptions.dataLayerName ||
              `datalayer`}', '${pluginOptions.id}');`,
        }}
      />,
    ])

    // TODO: add a test to verify iframe contains no line breaks. Ref: https://github.com/gatsbyjs/gatsby/issues/11014
    setPreBodyComponents([
      <noscript
        key="plugin-google-tagmanager"
        dangerouslySetInnerHTML={{
          __html: stripIndent`
            <iframe src="https://www.googletagmanager.com/ns.html?id=${
              pluginOptions.id
            }${environmentParamStr}" height="0" width="0" style="display: none; visibility: hidden"></iframe>`,
        }}
      />,
    ])
  }
}
