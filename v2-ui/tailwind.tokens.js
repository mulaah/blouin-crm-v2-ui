// À fusionner dans theme.extend de tailwind.config.js.
// Remplace le bloc colors.blouin existant (#C4A35A -> #C9A961, charte des slides).
module.exports = {
  colors: {
    blouin: {
      dark: '#2C1810',
      darkAlt: '#3D2417',
      darkHover: '#1A0D08',
      gold: '#C9A961',
      goldDark: '#A58843',
      goldSoft: '#EFE3C8',
      peach: '#D4A574',
      cream: '#FAF6EE',
      creamAlt: '#F5F3F0',
      line: '#E7E1D6',
      ink: '#201E1D',
      muted: '#7A6E62',
    },
    statut: {
      paye: '#0F7B5F',
      payeBg: '#E4F3EC',
      attente: '#9A6B12',
      attenteBg: '#FBF0D9',
      retard: '#B3341C',
      retardBg: '#FBE7E2',
      neutreBg: '#F0EDE7',
    },
  },
  fontFamily: {
    poppins: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
    inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  },
};
