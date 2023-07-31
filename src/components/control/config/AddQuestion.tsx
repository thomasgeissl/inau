import { useEffect, useRef, useState } from "react";
import useStore from "../../../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { MenuItem, Select, TextField } from "@mui/material";
import styled from '@emotion/styled';
import { types } from "../../../types/Question";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Container = styled.div`
padding: 16px;
.editor{
  background-color: white;
  color: black;
}`


interface AddQuestionProps {}

const AddQuestion: React.FC<AddQuestionProps> = ({}) => {
  const [type, setType] = useState("YES_NO");
  const [yesLabel, setYesLabel] = useState("yes");
  const [noLabel, setNoLabel] = useState("no");

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  return (
    <Container>
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
      <Editor
          editorState={editorState}
          wrapperClassName="wrapper"
          editorClassName="editor"
          onEditorStateChange={setEditorState}
        />

        {type === "YES_NO" && <>
        <TextField value={yesLabel} onChange={(event) => setYesLabel(event.target.value)}></TextField>
        <TextField value={noLabel} onChange={(event) => setNoLabel(event.target.value)}></TextField>

        </>}


    </Container>
  );
};

export default AddQuestion;
