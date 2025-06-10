import { Theme } from "@mui/material";
import { EnrollmentStatus } from "../types/enrollmentsTypes";
import { getColorKey } from "../utils/statusConfig";

export const tableStyles = {
  row: (status: EnrollmentStatus) => ({
    backgroundColor: (theme: Theme) => {
      const colorKey = getColorKey(status);
      return colorKey === 'default'
        ? theme.palette.background.default
        : theme.palette.state[colorKey].light;
    },
    '&:hover': {
      backgroundColor: (theme: Theme) => {
        const colorKey = getColorKey(status);
        return colorKey === 'default'
          ? theme.palette.background.paper
          : `${theme.palette.state[colorKey].main}25`;
      },
    },
  }),
}; 