'use client'
import promocodes from '../../data/dataPromocodes.json'

export function getStaticProxyPromocodes ()  {
    const staticProxies = Object?.entries(promocodes.Data.staticProxies.tools) || []

    return staticProxies

}

export function getAntikPromocodes () {
    const antikiCodes = Object?.entries(promocodes.Data.antidetectBrowsers.tools) || []

    return antikiCodes
}

export function getResidentialProxy(){
    const residentialProxies = Object?.entries(promocodes.Data.residentialProxies.tools) || []
    return residentialProxies
}

export function getAccShopsPromocodes(){
    const accsPromocodes = Object?.entries(promocodes.Data.accshops.tools) || []

    return accsPromocodes
}

export function getMobileProxyPromocodes(){
    const mobileProxies = Object?.entries(promocodes.Data.mobileProxies.tools) || []
    return mobileProxies
}