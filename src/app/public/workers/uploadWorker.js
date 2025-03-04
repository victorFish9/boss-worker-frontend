self.onmessage = async function (event) {
    const { files, token } = event.data;

    for (const file of files) {
        const formData = new FormData();
        formData.append("files", file);

        try {
            const response = await fetch("http://127.0.0.1:8000/storage/upload/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                self.postMessage({ status: "success", filename: file.name });
            } else {
                self.postMessage({ status: "error", filename: file.name, error: data.error });
            }
        } catch (error) {
            self.postMessage({ status: "error", filename: file.name, error: error.message });
        }
    }
};
