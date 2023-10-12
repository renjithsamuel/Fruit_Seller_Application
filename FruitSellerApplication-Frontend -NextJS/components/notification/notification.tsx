import { Typography, Box } from "@mui/material";

type NotificationProps = {
  message: string;
  showNotification: boolean;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

const Notification = ({
  message,
  showNotification,
  setShowNotification,
}: NotificationProps) => {
  return showNotification ? (
    <Box
      className="notification"
      onClick={() => {
        setShowNotification(false);
      }}
    >
      <Typography>{message}</Typography>
    </Box>
  ) : null;
};

export default Notification;
