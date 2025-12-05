// Configuration générique du casino - Modifiable pour chaque pays
export const CASINO_CONFIG = {
	// Informations de base
	name: "Pandido Casino",
	shortName: "Pandido",
	domain: "https://pandido-casino1.fr",
	
	// SEO
	metaTitle: "Pandido Casino - Bonus 200% jusqu'à €5,000 | Casino en Ligne Français",
	metaDescription: "Pandido Casino : Casino en ligne français avec bonus de bienvenue 200% jusqu'à €5,000. Plus de 1800 jeux de casino, retraits rapides et service client 24/7. Rejoignez Pandido Casino aujourd'hui !",
	
	// Lien d'affiliation
	affiliateLink: "https://m-traff.net/yk5QY2vs",
	
	// Bonus de bienvenue
	welcomeBonus: {
		percentage: "200%",
		maxAmount: "€5,000",
		freeSpins: 350,
		wagering: 35,
		minDeposit: "€10"
	},
	
	// Support
	support: {
		phone: "09 74 75 13 13",
		email: "support@pandido.fr"
	},
	
	// Statistiques
	stats: {
		totalGames: "1800+",
		slots: "2000+",
		liveDealer: "40+",
		providers: 15
	}
};

// Export des constantes pour compatibilité
export const SITE_TITLE = CASINO_CONFIG.metaTitle;
export const SITE_DESCRIPTION = CASINO_CONFIG.metaDescription;
export const AFFILIATE_LINK = CASINO_CONFIG.affiliateLink;
