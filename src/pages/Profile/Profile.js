import React from 'react'

const Profile = ()=>{
  let username = 'User1'
  let creationDate = 'April 27, 2020'
  let numberPosts = '3 Posts'
  let profilePic = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'
  let badges = [
    'https://www.iconpacks.net/icons/1/free-badge-icon-1361-thumb.png',
    'https://d29fhpw069ctt2.cloudfront.net/icon/image/49355/preview.svg',
    'https://cdn-icons-png.flaticon.com/512/66/66027.png'
  ]
  let posts = [
    'https://i.natgeofe.com/k/ff49e0e1-20b6-4c4b-84c8-4ad196e312e4/eastern-gray-squirrel-closeup_square.jpg',
    'https://www.allaboutbirds.org/guide/assets/photo/305880301-480px.jpg',
    'https://i.guim.co.uk/img/media/a6478477c7508115778a257a5011570f66032941/0_85_2048_1229/master/2048.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=afea1b033d076492c371b95545ba089f',
    'https://i.guim.co.uk/img/media/1e856b908ed2d6bf78bdd31fe9da6ee0d631b2ff/0_42_3000_1800/master/3000.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=32987f1fb0176563c3d108176ca2298e',
    'https://optimise2.assets-servd.host/steadfast-tern/production/carrion-crow-3.jpg?w=1200&h=900&q=80&fm=webp&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&dm=1623059646&s=38926422fb21675a1e6eab9fae1b0ff8'
  ]
  let verified = [
    true,
    false,
    true
  ]

const isVerified = (i)=>{
  if (verified[i]){
  return(
    <div>
      <img style={{width:"50px", height: "50px"}}
      src={'https://i0.wp.com/degreessymbolmac.com/wp-content/uploads/2020/02/check-mark-2025986_1280.png?fit=1280%2C945&ssl=1'}
      alt="checkmark"/>
    </div>)}
  else {
    return (
    <div>
      <img style={{width:"50px", height: "50px"}}
      src={'https://upload.wikimedia.org/wikipedia/commons/5/53/7_Local_Superclusters_%28blank_2%29.png'}
      alt="checkmark"/>
    </div>)
  }
}

  return (
    <table style={{margin:"25px 100px"}}> <tr>
      <th style={{ border:"1px solid grey"}}>
        <div>
          <div style={{
            justifyContent:"space around",
            margin:"50px 100px",
            }}>
            <div>
              <img style={{width:"160px", height: "160px"}}
              src={profilePic}
              alt="profile avatar"/> 
            </div>
            <div>
              <h1 style={{textAlign:"center"}}>{username}</h1>
              <h4 style={{textAlign:"center"}}>{numberPosts}</h4>
              <h4 style={{textAlign:"center"}}>Account Created: {creationDate}</h4>
            </div>
            <div>
              <table><tr>
                <th>
                  <div>
                  <img style={{width:"50px", height: "50px"}}
              src={badges[0]}
              alt="badge"/>
                  </div>
                </th>
                <th>
                  <div>
                  <img style={{width:"50px", height: "50px"}}
              src={badges[1]}
              alt="badge"/>
                  </div>
                </th>
                <th>
                  <div>
                  <img style={{width:"50px", height: "50px"}}
              src={badges[2]}
              alt="badge"/>
                  </div>
                </th>
              </tr></table>
            </div>
          </div>
        </div>
      </th>
      <th style={{ border:"1px solid grey"}}>
        <table style={{margin:"25px 50px", border:"1px solid grey"}}><tr>
          <table style={{border:"1px solid grey"}}><th>
            {isVerified(0)}
            </th>
            <th>
            <div>
              <h3>Squirrel</h3>
              <h6>1242 Gayley Street, LA, 92222</h6>
            </div>
            </th>
            <th>
              <div style={{
            justifyContent:"space around",
            margin:"0px 100px",
            }}>
                <div>
                  <img style={{width:"100px", height: "100px"}}
                  src={posts[0]}
                  alt="post"/>
                </div>
              </div>
            </th>
          </table>
          </tr>
          <tr style={{ border:"1px solid grey"}}>
          <table style={{border:"1px solid grey"}}><th>
          {isVerified(1)}
            </th>
            <th>
            <div>
              <h3>Sparrow</h3>
              <h6>1232 Gayley Street, LA, 92222</h6>
            </div>
            </th>
            <th>
              <div style={{
            justifyContent:"space around",
            margin:"0px 100px",
            }}>
                <div>
                  <img style={{width:"100px", height: "100px"}}
                  src={posts[1]}
                  alt="post"/>
                </div>
              </div>
            </th>
          </table>
          </tr>
          <tr style={{ border:"1px solid grey"}}>
          <table style={{border:"1px solid grey"}}><th>
          {isVerified(2)}
            </th>
            <th>
            <div>
              <h3>Rabbit</h3>
              <h6>1242 Gayley Street, LA, 92222</h6>
            </div>
            </th>
            <th>
              <div style={{
            justifyContent:"space around",
            margin:"0px 100px",
            }}>
                <div>
                  <img style={{width:"100px", height: "100px"}}
                  src={posts[2]}
                  alt="post"/>
                </div>
              </div>
            </th>
          </table>
          </tr>
        </table>
      </th>
    </tr></table>
  )
}

export default Profile;
