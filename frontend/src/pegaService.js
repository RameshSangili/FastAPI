const PEGA_BASE_URL = "https://lab-13895-us-east-1.external.pegalabs.io/prweb/PRServlet/app/personal-loan-application/api/application/v2";
const TOKEN_URL = "https://lab-13895-us-east-1.external.pegalabs.io/prweb/PRRestService/oauth2/v1/token";
const CLIENT_ID = "67881702533983457312"; // Replace with your OAuth client ID
const CLIENT_SECRET = "DA9B96DF05CF4F8DA35FAD7A95905E7A"; // Replace with your OAuth client secret

let accessToken = null;
let tokenExpiry = null;

// Get OAuth token
async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  console.log("Fetching new OAuth token...");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error(`OAuth failed: ${response.status}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

  console.log("OAuth token obtained");
  return accessToken;
}

// Create case
export async function createCase() {
  const token = await getAccessToken();

  const response = await fetch(`${PEGA_BASE_URL}/cases?viewType=page`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      caseTypeID: "ABC-Personal-Work-LoanApplication",
      content: {},
      processID: "pyStartCase",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Create case failed:", error);
    throw new Error("Failed to create loan application");
  }

  const data = await response.json();
  
  // Extract ETag from response headers
  const etag = response.headers.get('etag');
  console.log("Case created with ETag:", etag);

  return {
    data,
    etag
  };
}

// Submit personal info
export async function submitPersonalInfo(assignmentId, formData, etag) {
  const token = await getAccessToken();
  const encodedAssignmentId = encodeURIComponent(assignmentId);

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Add If-Match header with ETag
  if (etag) {
    headers["If-Match"] = etag;
    console.log("Adding If-Match header:", etag);
  }

  const response = await fetch(
    `${PEGA_BASE_URL}/assignments/${encodedAssignmentId}/actions/CollectPersonalDetails?viewType=page`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        content: formData,
        pageInstructions: [],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Submit personal info failed:", error);
    throw new Error("Failed to submit personal information");
  }

  const data = await response.json();
  const newEtag = response.headers.get('etag');
  console.log("Personal info submitted, new ETag:", newEtag);

  return {
    data,
    etag: newEtag
  };
}

// Submit employer info
export async function submitEmployerInfo(assignmentId, formData, etag) {
  const token = await getAccessToken();
  const encodedAssignmentId = encodeURIComponent(assignmentId);

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  if (etag) {
    headers["If-Match"] = etag;
    console.log("Adding If-Match header:", etag);
  }

  const response = await fetch(
    `${PEGA_BASE_URL}/assignments/${encodedAssignmentId}/actions/CollectEmployerInformation?viewType=page`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        content: formData,
        pageInstructions: [],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Submit employer info failed:", error);
    throw new Error("Failed to submit employer information");
  }

  const data = await response.json();
  const newEtag = response.headers.get('etag');
  console.log("Employer info submitted, new ETag:", newEtag);

  return {
    data,
    etag: newEtag
  };
}

// Submit mortgage info
export async function submitMortgageInfo(assignmentId, formData, etag) {
  const token = await getAccessToken();
  const encodedAssignmentId = encodeURIComponent(assignmentId);

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  if (etag) {
    headers["If-Match"] = etag;
    console.log("Adding If-Match header:", etag);
  }

  const response = await fetch(
    `${PEGA_BASE_URL}/assignments/${encodedAssignmentId}/actions/CollectMortgageData?viewType=page`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        content: formData,
        pageInstructions: [],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Submit mortgage info failed:", error);
    throw new Error("Failed to submit mortgage information");
  }

  const data = await response.json();
  const newEtag = response.headers.get('etag');
  console.log("Mortgage info submitted, new ETag:", newEtag);

  return {
    data,
    etag: newEtag
  };
}