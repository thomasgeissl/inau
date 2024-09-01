function base64toFile(base64String: string, filename: string): File | null {
  try {
    // Split the base64 string to get the content type and data
    const base64Data: string = base64String.split(";base64,").pop()!;
    const contentType: string = base64String.split(";")[0].split(":")[1];

    // Convert the base64 string to a Blob
    const byteCharacters: string = atob(base64Data);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice: string = byteCharacters.slice(offset, offset + 512);
      const byteNumbers: number[] = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray: Uint8Array = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob: Blob = new Blob(byteArrays, { type: contentType });

    // Create a File object from the Blob
    const file: File = new File([blob], filename, { type: contentType });
    return file;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export { base64toFile };