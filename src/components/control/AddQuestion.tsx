import { useEffect, useState } from "react";
import useStore from "../../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { MenuItem, Select } from "@mui/material";
import { types } from "../../types/Question";

interface AddQuestionProps {}

const AddQuestion: React.FC<AddQuestionProps> = ({}) => {
  const responses = useStore((state) => state.responses);
  const questions = useStore((state) => state.questions);
  const uuid = useParams().uuid ?? "";
  const [type, setType] = useState("YES_NO");
  const [text, setText] = useState("");
  return (
    <>
      <Select
        fullWidth
        value={type}
        onChange={(event) => setType(event.target.value)}
        color="primary"
      >
        {types.map((type) => {
          return (
            <MenuItem value={type} key={type}>
              {type}
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
};

export default AddQuestion;
