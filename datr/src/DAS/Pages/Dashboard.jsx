import React from 'react'
import { SearchPage } from '../../Reusable/SearchPage'
import { CurrentDASDatat, DASDashboardPerformanceGraphData } from '../../CPD/data/data'
import { StatCard } from '../../CPD/Components/DashboardStats'
import { useNavigate, useParams } from 'react-router'
import { DashboardPerformanceGraph } from '../Components/Graph'
import { AiOutlinePlus } from 'react-icons/ai'

export const DASDashboard = () => {
    const {Location}=useParams()
    const nav =useNavigate()
  return (
    <section className="w-full max-h-screen overflow-y-auto">
        <SearchPage heading={Location}>
            <div className='flex justify-center items-center rounded-lg shadow-md w-52 h-10 bg-lightPink text-white gap-2 hover:scale-90 transition-all' onClick={()=>{nav(`/DAS/${Location}/New`)}}>Add Entry <AiOutlinePlus className='w-6 h-6 aspect-square bg-white text-lightPink rounded-full'/></div>
        <div className="flex  gap-4 justify-evenly  my-2  items-center  flex-wrap">
        {
            CurrentDASDatat.map((datum)=>{
                return  <StatCard  {...datum} key={datum.id}   />
            })
        } 
        <DashboardPerformanceGraph data={DASDashboardPerformanceGraphData} categories={['Apr 1st','Apr 2nd']} title={'Flight Performance'}/>
        </div>
        </SearchPage>
    </section>
  )
}
