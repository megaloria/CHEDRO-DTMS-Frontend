import React  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'


 const SidebarData = [
    {
        title:"Documents",
        icon: faCoffee,
        link:"/documents"
    },
    {
        title:"Settings",
        icon: faCoffee,
        link:"/sample",
        iconClosed: faCoffee,
    },
    {
        title:"Users",
        icon: faCoffee,
        link:"/Users"
    }
]



export default SidebarData