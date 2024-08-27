import {
    Box,
    Divider,
    Modal as MuiModal,
    Typography,
  } from "@mui/material";
  
  
  interface Props {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: any;
    actions?: any;
    large?: boolean;
  }
  export default function Modal({
    open,
    onClose,
    children,
    title,
    actions,
    large,
  }: Props) {
  
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // bgcolor: "rgb(30,30,30)",
    bgcolor: "background.paper",
    boxShadow: 48,
    p: 4,
    // color: "text.primary",
    width: large ? "1000px" : "500px"
  };
  
  
    return (
      <MuiModal open={open} onClose={onClose}>
        <Box display={"flex"} flexDirection={"column"} sx={style}>
          {title !== "" && (
            <>
              <Typography variant="h5">{title}</Typography>
              <Divider sx={{ margin: "12px 0" }}></Divider>
            </>
          )}
          {children && <Box margin={"24px 0"}>{children}</Box>}
          {actions && (
            <>
              <Divider sx={{ margin: "12px 0" }}></Divider>
              <Box>{actions}</Box>
            </>
          )}
        </Box>
      </MuiModal>
    );
  }