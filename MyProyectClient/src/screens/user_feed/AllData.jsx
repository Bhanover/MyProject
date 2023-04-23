import React, { useContext } from 'react';
import { DataContext } from './DataContext';
import UserVideos from '../user_videos/UserVideos';
import UserImages from '../user_images/UserImages';
import PublicationList from '../publication_list/PublicationList';
const AllData = () => {
  const data = useContext(DataContext);

  if (!data.userVideos || !data.userImages || !data.publications) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div>
      <UserVideos userVideos={data.userVideos} />
      <UserImages userImages={data.userImages} />
      <PublicationList publications={data.publications} />
    </div>
  );
};

export default AllData;