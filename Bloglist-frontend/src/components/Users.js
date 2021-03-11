import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'


const style1 = {
  float: 'left',
  
}
const style2 = {
  float: 'right',
  marginRight: 1100
}


const Users = ({users}) => {
  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <tbody>
          {users.map(user => 
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`} >{user.name}</Link>
              </td>
              <td>
                <div>{user.blogs.length}</div>
              </td>
            </tr>)}
        </tbody>
      </Table>
    </div>
  )
}

export default Users