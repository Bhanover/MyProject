

const UserProfile = () => {
 /* const { user,setUser } = useUser();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!user) {
      // Fetch user information here
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:8081/api/auth/user", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, [user, setUser]);
  
  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
  
    // Submit file upload here
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    try {
      const response = await axios.post("http://localhost:8081/api/auth/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        }
      });
      alert("File uploaded successfully.");
      // Update user data with the new profile image URL
      setUser({ ...user, profileImage: response.data.url });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed.");
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <>
          <h2>{user.username}</h2>
          <h2>{user.email}</h2>
          <form onSubmit={onSubmit}>
            <input type="file" onChange={onFileChange} />
            <button type="submit">Upload</button>
          </form>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};*/
}

export default UserProfile;