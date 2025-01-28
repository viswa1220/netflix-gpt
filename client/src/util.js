export const graphQLCommand = async (query, variables = {}) => {
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001/graphql";

    console.log("GraphQL Endpoint:", backendUrl); 

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors.map((err) => err.message).join("\n"));
    }

    return json.data;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
};
