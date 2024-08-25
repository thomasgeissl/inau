import { useEffect } from "react";
import { Box, Card, Typography } from "@mui/material";
import useStore from "../stores/control";
import { Link, useNavigate } from "react-router-dom";
interface ShowsProps {}

const Shows: React.FC<ShowsProps> = ({}) => {
    const navigate = useNavigate()
  const init = useStore(state => state.init)
  const shows = useStore(state => state.shows)
  useEffect(()=>{
    init()
  }, [])
  
  return (
    <Box>
        <Typography variant="h4">Shows</Typography>
        <Box>
            {shows?.map(show => (
                <Card key={show.id} onClick={()=>{
                    navigate(`/shows/${show.id}`);
                }}>
                    <Typography variant="h5">{show.title}</Typography>
                    <Link to={`/shows/${show.id}`}>View Show</Link>
                </Card>
            ))}
        </Box>
    </Box>
  );
};

export default Shows;
