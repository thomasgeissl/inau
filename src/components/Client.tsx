import { useEffect } from "react";
import useStore from "../stores/client";
import Question from "./client/Question";

interface ClientProps {}

const Client: React.FC<ClientProps> = ({}) => {
  const init = useStore((state) => state.init);
  const question = useStore((state) => state.question);
  useEffect(() => {
    init();
  }, []);
  return <>{question && <Question question={question} />}</>;
};

export default Client;
