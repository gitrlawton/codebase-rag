// TODO: Integrate with LLM and vector database.

// Function to generate embeddings
export async function generateEmbeddings(text) {
  // TODO: Use an embedding model to generate embeddings
  // Placeholder 128-dimensional embedding
  return Array(128)
    .fill(0)
    .map(() => Math.random());
}

// Function to index a codebase
export async function indexCodebase(url, name) {
  // TODO:
  // 1. Clone or download the codebase
  // 2. Parse and tokenize the code
  // 3. Generate embeddings for code snippets
  // 4. Store the embeddings in a vector database
  console.log(`Indexing codebase: ${name} (${url})`);
}

// Function to fetch repository contents
export async function fetchRepoContents(repoUrl, githubToken = null) {
  const urlParts = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!urlParts) {
    throw new Error("Invalid GitHub repository URL");
  }

  const [, owner, repo] = urlParts;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;

  try {
    // Add auth header if token exists
    const headers = {
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }

    const contents = await response.json();

    if (!Array.isArray(contents)) {
      throw new Error(`Invalid API response: ${JSON.stringify(contents)}`);
    }

    // Recursive function to fetch file contents
    const fetchFileContents = async (items) => {
      if (!Array.isArray(items)) {
        throw new Error("Expected array of items for processing");
      }

      const fileContents = [];

      for (const item of items) {
        try {
          if (item.type === "file") {
            const fileResponse = await fetch(item.download_url);
            if (!fileResponse.ok) {
              console.warn(
                `Failed to fetch ${item.path}: ${fileResponse.status}`
              );
              continue;
            }
            const fileText = await fileResponse.text();
            fileContents.push({
              name: item.name,
              path: item.path,
              content: fileText,
            });
          } else if (item.type === "dir") {
            // Add delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const dirContentsResponse = await fetch(item.url, { headers });
            if (!dirContentsResponse.ok) {
              console.warn(
                `Failed to fetch directory ${item.path}: ${dirContentsResponse.status}`
              );
              continue;
            }
            const dirContents = await dirContentsResponse.json();
            if (Array.isArray(dirContents)) {
              const subDirContents = await fetchFileContents(dirContents);
              fileContents.push(...subDirContents);
            }
          }
        } catch (error) {
          console.warn(`Error processing ${item.path}:`, error);
          continue;
        }
      }

      return fileContents;
    };

    return await fetchFileContents(contents);
  } catch (error) {
    console.error("Error fetching repository contents:", error);
    throw error;
  }
}

export let codebases = [];

export function addCodebase(codebase) {
  codebases.push(codebase);
}

export function getCodebases() {
  return codebases;
}
