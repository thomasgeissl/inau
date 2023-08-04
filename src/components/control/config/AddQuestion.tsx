import { useEffect, useState } from "react";
import useStore from "../../../stores/control";
import _ from "lodash";
import { Button, IconButton, MenuItem, Select, TextField } from "@mui/material";
import styled from "@emotion/styled";
import { Question, types } from "../../../types/Question";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { convertToHTML } from "draft-convert";
import { v4 } from "uuid";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Delete, PlusOne } from "@mui/icons-material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  .editor {
    background-color: white;
    color: black;
  }
  margin-top: 32px;
`;
const Content = styled.div`
  background-color: rgb(64, 64, 64);
  padding: 16px;
`;
const Actions = styled.div`
  display: flex;
  margin-top: 32px;
`;

interface AddQuestionProps {
  onQuestionAdded: () => void;
  onCancel: () => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({
  onQuestionAdded,
  onCancel,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [type, setType] = useState("YES_NO");
  const [yesLabel, setYesLabel] = useState("yes");
  const [noLabel, setNoLabel] = useState("no");
  const [labelMin, setLabelMin] = useState("negative");
  const [labelMax, setLabelMax] = useState("positive");
  const [wordCount, setWordCount] = useState(1);
  const [numberOfSelections, setNumberOfSelections] = useState(1);
  const [options, setOptions] = useState([] as string[]);
  const addQuestion = useStore((state) => state.addQuestion);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  return (
    <Container>
      <Content>
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
        {isMounted && (
          <>
            <div style={{ marginTop: "16px" }}>
              <Editor
                editorState={editorState}
                wrapperClassName="wrapper"
                editorClassName="editor"
                onEditorStateChange={setEditorState}
              />
            </div>
            <TextField
              label="image url"
              color="primary"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              sx={{ marginTop: "16px" }}
            ></TextField>
          </>
        )}

        {type === "YES_NO" && (
          <div style={{ marginTop: "16px" }}>
            <TextField
              label="yes label"
              color="primary"
              value={yesLabel}
              onChange={(event) => setYesLabel(event.target.value)}
            ></TextField>
            <TextField
              label="no label"
              value={noLabel}
              onChange={(event) => setNoLabel(event.target.value)}
            ></TextField>
          </div>
        )}
        {type === "RATING" && (
          <>
            <TextField
              label="label min"
              color="primary"
              value={labelMin}
              onChange={(event) => setLabelMin(event.target.value)}
            ></TextField>
            <TextField
              label="label max"
              value={labelMax}
              onChange={(event) => setLabelMax(event.target.value)}
            ></TextField>
          </>
        )}
        {type === "TEXT" && (
          <>
            <TextField
              label="word count"
              color="primary"
              value={wordCount}
              onChange={(event) => setWordCount(parseInt(event.target.value))}
              type="number"
            ></TextField>
          </>
        )}
        {type === "MULTIPLE_CHOICE" && (
          <>
            <TextField
              label="number of selection"
              color="primary"
              value={numberOfSelections}
              onChange={(event) =>
                setNumberOfSelections(parseInt(event.target.value))
              }
              type="number"
            ></TextField>
            {options.map((option, index) => {
              return (
                <TextField
                  key={`option-${index}`}
                  label={`option ${index}`}
                  color="primary"
                  value={option}
                  onChange={(event) => {
                    const newOptions = [...options];
                    newOptions[index] = event.target.value;
                    setOptions(newOptions);
                  }}
                />
              );
            })}
            <IconButton onClick={() => setOptions([...options, ""])}>
              <PlusOne></PlusOne>
            </IconButton>
          </>
        )}
      </Content>
      <Actions>
        <Button variant="outlined" onClick={() => onCancel()}>
          <Delete></Delete>
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            let question: Question | null = null;
            if (type === "YES_NO") {
              question = {
                uuid: v4(),
                type,
                text: convertToHTML(editorState.getCurrentContent()),
                img: imageUrl,
                labelYes: yesLabel,
                labelNo: noLabel,
              };
            }
            if (type === "TEXT") {
              question = {
                uuid: v4(),
                type,
                text: convertToHTML(editorState.getCurrentContent()),
                img: imageUrl,
                wordCount,
              };
            }
            if (type === "RATING") {
              question = {
                uuid: v4(),
                type,
                text: convertToHTML(editorState.getCurrentContent()),
                img: imageUrl,
                labelMin,
                labelMax,
              };
            }
            if (type === "MULTIPLE_CHOICE") {
              question = {
                uuid: v4(),
                type,
                text: convertToHTML(editorState.getCurrentContent()),
                img: imageUrl,
                options,
                numberOfSelections,
              };
            }
            if (question) {
              addQuestion(question);
              if (onQuestionAdded) {
                onQuestionAdded();
              }
            }
          }}
        >
          save
        </Button>
      </Actions>
    </Container>
  );
};

export default AddQuestion;
