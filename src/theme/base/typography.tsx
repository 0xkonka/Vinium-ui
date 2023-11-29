import colors from './colors';

const baseProperties = {
  fontFamily: 'Gideon Roman',
  fontWeightLight: 300,
  fontWeightMedium: 325,
  fontWeightBold: 700,
  color: colors.primary.light,
};

const baseHeadingProperties = {
  fontFamily: 'Gideon Roman',
  fontWeightLight: baseProperties.fontWeightLight,
  fontWeightMedium: baseProperties.fontWeightMedium,
  fontWeightBold: baseProperties.fontWeightBold,
};

const typography = {
  fontFamily: baseProperties.fontFamily,
  fontWeightLight: baseProperties.fontWeightLight,
  fontWeightMedium: baseProperties.fontWeightMedium,
  fontWeightBold: baseProperties.fontWeightBold,
  color: baseProperties.color,

  // h1: {
  //   fontSize: "64px",

  //   "@media (min-width:992px)": {
  //     fontSize: "64px",
  //   },
  //   lineHeight: 1.25,
  //   fontWeight: baseHeadingProperties.fontWeightBold,
  //   ...baseHeadingProperties,
  // },
  // h2: {
  //   fontSize: "32px",
  //   "@media (min-width:992px)": {
  //     fontSize: "32px",
  //   },
  //   lineHeight: 1.3,

  //   fontWeight: baseHeadingProperties.fontWeightBold,
  //   ...baseHeadingProperties,
  // },
  // h3: {
  //   fontSize: "24px",
  //   "@media (min-width:992px)": {
  //     fontSize: "36px",
  //   },
  //   lineHeight: 1.375,
  //   fontWeight: baseProperties.fontWeightMedium,
  //   ...baseHeadingProperties,
  // },
  // h4: {
  //   fontSize: "20px",
  //   "@media (min-width:992px)": {
  //     fontSize: "24px",
  //   },
  //   lineHeight: 1.375,

  //   fontWeight: baseHeadingProperties.fontWeightBold,
  //   ...baseHeadingProperties,
  // },
  // h5: {
  //   fontSize: "20px",
  //   "@media (min-width:992px)": {
  //     fontSize: "20px",
  //   },
  //   lineHeight: 1.375,

  //   fontWeight: baseHeadingProperties.fontWeightBold,
  //   ...baseHeadingProperties,
  // },
  // h6: {
  //   fontSize: "14px",
  //   "@media (min-width:992px)": {
  //     fontSize: "18px",
  //   },
  //   lineHeight: 1.625,

  //   fontWeight: baseHeadingProperties.fontWeightBold,
  //   ...baseHeadingProperties,
  // },
  // subtitle1: {
  //   fontSize: "20px",
  //   "@media (min-width:992px)": {
  //     fontSize: "14px",
  //   },
  //   fontWeight: baseProperties.fontWeightMedium,
  //   fontFamily: baseHeadingProperties.fontFamily,
  //   lineHeight: 1.625,
  // },
  // subtitle2: {
  //   fontSize: "36px",

  //   "@media (min-width:992px)": {
  //     fontSize: "36px",
  //   },
  //   lineHeight: 1.25,
  //   fontWeight: baseHeadingProperties.fontWeightBold,
  //   ...baseHeadingProperties,
  // },
  // body1: {
  //   fontSize: "14px",
  //   "@media (min-width:992px)": {
  //     fontSize: "16px",
  //   },
  //   fontFamily: baseHeadingProperties.fontFamily,
  //   fontWeight: 325,
  //   lineHeight: "22px",
  // },
  // body2: {
  //   fontSize: "25px",
  //   "@media (min-width:992px)": {
  //     fontSize: "25px",
  //   },
  //   fontFamily: baseHeadingProperties.fontFamily,
  //   fontWeight: 300,
  //   lineHeight: "30px",
  // },

  // lineHeight: {
  //   sm: 1.25,
  //   md: 1.5,
  //   lg: 2,
  // },
};

export default typography;
