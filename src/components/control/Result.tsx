import { useEffect } from "react";
import useStore from "../../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";

interface ResultProps {}

const Result: React.FC<ResultProps> = ({}) => {
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
      {question.type === "MULTIPLE_CHOICE" && (
        <>
          {question.numberOfSelections === 1 && (
            <>
              {question.options.map((option: any) => {
                return (
                  <li key={`option-${option}`}>
                    {option}:{" "}
                    {
                      responses[uuid].filter((o: any) => o.value === option)
                        .length
                    }
                  </li>
                );
                responses[uuid];
              })}
            </>
          )}
          {question.numberOfSelections > 1 && (
            <>
              {_.uniq(
                responses[uuid]
                  .map((option: any) => {
                    return option.value;
                  })
                  .flat()
              ).map((option: any) => {
                // {question.options.map((option: any) => {
                return (
                  <li key={`option-${option}`}>
                    {option}:{" "}
                    {
                      // question.options
                      responses[uuid]
                      .map((response: any) => response.value)
                        .flat()
                        // .map((option: any) => {
                        //   return option.value;
                        // })
                        .filter((o: any) => o === option).length
                    }
                  </li>
                );
              })}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Result;
