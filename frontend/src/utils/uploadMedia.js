import axios from 'axios';

const API = '/api';

// Uploads a file for the admin dashboard and resolves to the API's response
// ({ success, url, data }).
//
// The file goes straight from the browser to R2 using a short-lived signed URL
// from the API, so it never passes through the API itself (Vercel caps
// request bodies at 4.5 MB, smaller than our 3D models). When the API has no
// R2 configured (local development) it answers 501 and we fall back to the
// one-request upload through the API.
export const uploadMedia = async (file, token) => {
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  let signed;
  try {
    ({ data: signed } = await axios.post(`${API}/media/upload-url`, { name: file.name, size: file.size }, auth));
  } catch (err) {
    if (err.response?.status !== 501) throw err;
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axios.post(`${API}/media/upload`, formData, {
      headers: { ...auth.headers, 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }

  // Plain fetch, not axios: the signed URL must get no Authorization header,
  // and the Content-Type has to match the one it was signed for.
  const put = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': signed.contentType },
    body: file,
  });
  if (!put.ok) {
    const error = new Error('Upload to storage failed.');
    error.response = { data: { message: `Upload to storage failed (${put.status}).` } };
    throw error;
  }

  const { data } = await axios.post(`${API}/media`, { name: file.name, url: signed.url, size: file.size }, auth);
  return data;
};
