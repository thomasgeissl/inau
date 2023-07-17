import { useEffect } from "react";
import useStore from "../../stores/control";
import { useParams } from "react-router-dom";
import Header from "./Header";

interface ResultProps {}

const Config: React.FC<ResultProps> = ({}) => {
  const responses = useStore((state) => state.responses);
  const questions = useStore((state) => state.questions);
  const uuid = useParams().uuid ?? "";
  const question = questions.find((question) => question.uuid === uuid);
  if (!question) {
    return <>invalid uuid</>;
  }
  return (
    <>
      {/* TODO: check if uuid is valid */}
      result {uuid}
      <div>{question.text}</div>
      {question.type === "YES_NO" && (
        <div>
          {question.labelYes && (
            <>
              {question.labelYes}:{" "}
              {responses[uuid].filter((response: any) => response.value).length}
            </>
          )}
          <br></br>
          {question.labelNo && (
            <>
              {question.labelNo}:{" "}
              {
                responses[uuid].filter((response: any) => !response.value)
                  .length
              }
            </>
          )}
        </div>
      )}
      {question.type === "RATING" && (
        <div>
          <>
            rating:{" "}
            {responses[uuid].reduce(
              (acc: Number, current: any) => acc + current.value,
              0
            ) / responses[uuid].length}
            {/* {responses[uuid].length} */}
          </>
        </div>
      )}
      {question.type === "TEXT" && (
        <div>
          {responses[uuid].map((response: any) => {
            return <div key={response.user}>{response.value}</div>;
          })}
        </div>
      )}
    </>
  );
};

export default Config;
