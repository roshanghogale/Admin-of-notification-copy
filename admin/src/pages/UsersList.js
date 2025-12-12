import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Box, Button, IconButton } from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/list');
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/user-registration')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" color="primary">
            Registered Users ({users.length})
          </Typography>
        </Box>
        
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={2}>
            {users.map((user) => (
              <Grid item xs={6} sm={4} md={3} lg={3} xl={2.4} key={user.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    aspectRatio: '1/1',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 200,
                    width: '100%',
                    position: 'relative'
                  }}
                >
                  <IconButton
                    onClick={() => handleDelete(user.id)}
                    sx={{ 
                      position: 'absolute', 
                      top: 4, 
                      right: 4, 
                      zIndex: 1,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,0,0,0.1)' }
                    }}
                    size="small"
                  >
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    height: '100%',
                    p: 2
                  }}>
                    <Avatar
                      src={user.profile_photo_url ? `http://localhost:3000${user.profile_photo_url}` : ''}
                      sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {user.name} {user.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(user.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;