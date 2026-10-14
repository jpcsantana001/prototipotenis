/**
 * Identidade visual da Boneti — arquivos originais servidos pelo CDN da loja (Shopify).
 * Nada aqui foi recriado: logo e foto são os mesmos usados em bonetistore.com.
 */
const CDN = "https://cdn.shopify.com/s/files/1/0779/9822/7738/files/";

/**
 * Logo branca com fundo transparente (3000×3000).
 * A marca ocupa ~3–97% da largura e ~30–71% da altura do arquivo; o componente
 * BrandLogo recorta essa margem com um box de proporção LOGO_RATIO e object-cover.
 */
export const LOGO_URL = `${CDN}LogoBonetiBranca.png`;
export const LOGO_RATIO = 2.33;

/**
 * Foto da campanha da loja (banner "3_DESKTOP", 1580×800). Pedimos ao CDN só os
 * 470 px de baixo (crop=bottom): fica a galera de capuz e sai o texto
 * "Bem vindo / cupom" que vem impresso na arte do banner.
 */
export const HERO_PHOTO_URL = `${CDN}3_DESKTOP.png?width=1580&height=470&crop=bottom`;
