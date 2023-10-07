import { Typography , Box} from "@mui/material";
import React, { useEffect, useState } from "react";

type NotificationProps = {
  message: string;
  duration: number;
  onClose: () => void;
};

const Notification= ({ message, duration, onClose }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return isVisible ? (
    <Box className="notification" onClick={()=>{setIsVisible(false)}}>
      <Typography>{message}</Typography>
    </Box>
  ) : null;
};

export default Notification;