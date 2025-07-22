import { useSelector } from 'react-redux';

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);

  if (!user) {
    return <div className="p-10">No user information available.</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">User Profile</h1>
      <div className="mb-2">Name: <span className="font-semibold">{user.name}</span></div>
      <div className="mb-2">Role: <span className="font-semibold">{role}</span></div>
    </div>
  );
};

export default UserProfile;
