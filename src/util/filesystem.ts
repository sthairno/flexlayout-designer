export default async function openFileAsync(): Promise<{
  file: File | null;
  handle: FileSystemFileHandle | null;
}> {
  if ("showOpenFilePicker" in window) {
    let fileHandle: FileSystemFileHandle;

    try {
      const handles: FileSystemFileHandle[] = await (
        window as any
      ).showOpenFilePicker({
        types: [
          {
            description: "FlexLayout File",
            accept: {
              "application/xml": [".xml"],
            },
          },
        ],
      });
      fileHandle = handles[0];
    } catch (e: any) {
      if (e.name === "AbortError") {
        return {
          file: null,
          handle: null,
        };
      }
      throw e;
    }

    return {
      file: await fileHandle.getFile(),
      handle: fileHandle,
    };
  } else {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xml";

    const file = await new Promise<File | null>((resolve) => {
      input.click();
      input.onchange = () => {
        if (input.files) {
          resolve(input.files.item(0)!);
        } else {
          resolve(null);
        }
      };
    });

    return {
      file: file,
      handle: null,
    };
  }
}

export async function showSaveFileDialogAsync(
  suggestedName: string
): Promise<FileSystemFileHandle | null> {
  try {
    const fileHandle: FileSystemFileHandle = await (
      window as any
    ).showSaveFilePicker({
      types: [
        {
          description: "FlexLayout File",
          accept: {
            "application/xml": [".xml"],
          },
        },
      ],
      suggestedName: suggestedName,
    });
    return fileHandle;
  } catch (e: any) {
    if (e.name !== "AbortError") {
      console.error(e);
      alert("Failed to open file");
    }

    return null;
  }
}

export async function saveFileAsync(
  data: string,
  fileName: string,
  fileHandle: FileSystemFileHandle | null = null
): Promise<void> {
  if (fileHandle || "createWritable" in window) {
    const writer = await (fileHandle as any).createWritable({
      keepExistingData: false,
    });

    await writer.write(data);
    await writer.close();
  } else {
    const blob = new Blob([data], { type: "application/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
    a.remove();
  }
}
