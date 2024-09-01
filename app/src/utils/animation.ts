const isBodymovinAnimation = (jsonData: any)  => {
  return (
    jsonData.hasOwnProperty("v") && // Check for version
    jsonData.hasOwnProperty("ip") && // Check for inPoint
    jsonData.hasOwnProperty("op") && // Check for outPoint
    jsonData.hasOwnProperty("layers")
  ); // Check for layers array
}

export { isBodymovinAnimation };
