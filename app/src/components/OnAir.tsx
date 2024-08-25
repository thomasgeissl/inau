import useStore from "../stores/control";
import { Box, BoxProps } from "@mui/material";
import { useEffect, useState } from "react";
import { keyframes } from "@mui/system";
import { intervalToDuration } from "date-fns";

interface OnAirProps extends BoxProps {}

const blinkAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const OnAir: React.FC<OnAirProps> = (props: OnAirProps) => {
  const startTime = useStore((state) => state.startTime);
  const [time, setTime] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();

      // Calculate the duration
      const duration = intervalToDuration({
        start: startTime || now,
        end: now,
      });

      // Format the duration as hh:mm:ss
      const formattedTime = [
        String(duration.hours ?? 0).padStart(2, "0"),
        String(duration.minutes ?? 0).padStart(2, "0"),
        String(duration.seconds ?? 0).padStart(2, "0"),
      ].join(":");

      setTime(formattedTime);
    }, 1000);

    // Clear the interval when the component unmounts or startTime changes
    return () => clearInterval(intervalId);
  }, [startTime]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      gap={3}
      width="100%"
      sx={{
        // animation: `${blinkAnimation} 3s infinite`,
      }}
      {...props}
    >
      live - {time}
    </Box>
  );
};

export default OnAir;
