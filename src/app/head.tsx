export default function Head() {
    return (
      <>
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&subset=cyrillic" as="style" />
        <script defer src="https://metric.researched.xyz/script.js" data-website-id="a9b97fed-3e50-4ffa-bcff-3e1efc93b33f" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#121313" />
        <link rel="apple-touch-icon" href="/icon/phone_icon/apple-touch-icon.png" />
  
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://researched.xyz/#organization",
                  name: "researched.xyz",
                  url: "https://researched.xyz",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://researched.xyz/icon/phone_icon/android-chrome-512x512.png"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://researched.xyz/#website",
                  url: "https://researched.xyz",
                  name: "researched.xyz",
                  description: "researched.xyz — агрегатор сервисов для мультиаккаунтинга. Прокси, антидетекты, боты, кошельки, CEX, OTC и многое другое.",
                  publisher: {
                    "@id": "https://researched.xyz/#organization"
                  }
                },
                {
                  "@type": "WebPage",
                  "@id": "https://researched.xyz/#webpage",
                  url: "https://researched.xyz",
                  name: "Купить расходники для мультиаккаунтинга и крипты",
                  isPartOf: {
                    "@id": "https://researched.xyz/#website"
                  }
                },
                {
                  "@type": "Article",
                  url: "https://researched.xyz/multiaccounting",
                  headline: "Гайд по мультиаккаунтингу в крипте",
                  isPartOf: {
                    "@id": "https://researched.xyz/#website"
                  }
                },
                {
                  "@type": "Article",
                  url: "https://researched.xyz/rs-score-antidetect",
                  headline: "Researched Antidetect Score"
                },
                {
                  "@type": "Article",
                  url: "https://researched.xyz/rs-score-proxy",
                  headline: "Researched Proxy Score"
                },
                {
                  "@type": "WebPage",
                  url: "https://researched.xyz/proxy-mobile",
                  name: "Лучшие мобильные прокси для мультиаккаунтинга"
                },
                {
                  "@type": "WebPage",
                  url: "https://researched.xyz/proxy-residential",
                  name: "Лучшие резидентские прокси для мультиаккаунтинга"
                },
                {
                  "@type": "WebPage",
                  url: "https://researched.xyz/proxy-static",
                  name: "Лучшие статичные прокси для мультиаккаунтинга"
                },
                {
                  "@type": "WebPage",
                  url: "https://researched.xyz/proxy-depin",
                  name: "Лучшие прокси для DePIN проектов"
                },
                {
                  "@type": "WebPage",
                  url: "https://researched.xyz/tradingbots",
                  name: "Лучшие трейдинг боты для мемкоинов"
                },
                {
                  "@type": "WebPage",
                  url: "https://researched.xyz/antiki",
                  name: "Лучшие антидетекты для мультиаккаунтинга"
                },
                {
                  "@type": "WebPage",
                  url: "https://researched.xyz/shops",
                  name: "Магазины аккаунтов для мультиаккаунтинга"
                },
                {
                  "@type": "WebPage",
                  url: "https://researched.xyz/cex",
                  name: "9 лучших CEX бирж для крипты"
                },
                {
                  "@type": "WebPage",
                  url: "https://researched.xyz/otc",
                  name: "Лучшие OTC для крипты"
                },
                {
                  "@type": "WebPage",
                  url: "https://researched.xyz/wallets",
                  name: "Лучшие кошельки для крипты"
                }
              ]
            })
          }}
        />
      </>
    );
  }
  