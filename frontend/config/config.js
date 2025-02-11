import { useMediaQuery, useTheme } from "@mui/material";

export const RENDER_BASE_IMAGE = "/plaques/plaque_vide.jpg";
export const MAX_GRAVURE_PER_PLAQUE = 2;
export const ITEM_CATEGORYS = ["cylindres", "retros", "variateurs", "prises", "gravures", "liseuses"];

export const useMediaQueries = () => {
  const theme = useTheme();

  const IS_XS = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const IS_SM = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const IS_MD = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const UP_XL = useMediaQuery(theme.breakpoints.up("xl"));
  const UP_XXL = useMediaQuery((theme) => theme.breakpoints.up("xxl"));

  const IS_MOBILE = useMediaQuery(theme.breakpoints.down("md"));

  return { IS_XS, IS_SM, IS_MD, UP_XL, UP_XXL, IS_MOBILE };
};
