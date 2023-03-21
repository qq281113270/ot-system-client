import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, {
  Children,
  cloneElement
  // useCallback,
  // useEffect,
  // useState
} from "react";
// import { stabilization } from "utils";

// const $stabilization = stabilization();

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end"
}));
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open, width }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${width}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    })
  })
);
export default (props) => {
  const {
    width,
    open,
    children,
    onChange = () => {},
    windosWidth,
    p = 3,
    menuProps = {},
    sx = {}
  } = props;
  // const [windosWidth, setWindosWidth] = useState(
  //   document.documentElement.clientWidth
  // );

  // /*
  //  小于950是平板
  //  小于600是手机
  // */
  // const getWindosWidth = useCallback(async () => {
  //   await $stabilization(300);
  //   setWindosWidth(document.documentElement.clientWidth);
  // }, []);

  // useEffect(() => {
  //   window.addEventListener("resize", getWindosWidth);
  //   return () => {
  //     window.removeEventListener("resize", getWindosWidth);
  //   };
  // }, []);

  return windosWidth >= 950 ? (
    <Box
      component="main"
      key={"box"}
      sx={{ flexGrow: 1, p, ...sx }}
      {...menuProps}>
      <DrawerHeader />
      {Children.map(children, (child) => {
        return (
          <>
            {cloneElement(child, {
              windosWidth,
              onChangeOpen: onChange
            })}
          </>
        );
      })}
    </Box>
  ) : (
    <Main key={"main"} open={open} width={width} sx={{ ...sx }} {...menuProps}>
      <DrawerHeader />
      {Children.map(children, (child) => {
        return (
          <>
            {cloneElement(child, {
              windosWidth,
              onChangeOpen: onChange
            })}
          </>
        );
      })}
    </Main>
  );
};
