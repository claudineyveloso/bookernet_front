
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import LogoutButton from "../../components/LogoutButton";



export default async function Page() {
  const session = await getServerSession()
  if (!session) {
    redirect("/");
  }

  return (
    <>
      {/* <div>Olá, {session?.user?.email} </div>
      <div>Dashboard</div>
      <div><LogoutButton /></div> */}
      <div><LogoutButton /></div>
      <div className="grid">
        <div className="col-12 lg:col-6 xl:col-3">
          <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Chamadas</span>
                <div className="text-900 font-medium text-xl">152</div>
              </div>
              <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-phone text-blue-500 text-xl" />
              </div>
            </div>
            <span className="text-green-500 font-medium">24 novas </span>
            <span className="text-500">novas chamada</span>
          </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
          <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Receita</span>
                <div className="text-900 font-medium text-xl">R$ 2.100</div>
              </div>
              <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-map-marker text-orange-500 text-xl" />
              </div>
            </div>
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">desde o último registro</span>
          </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
          <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Clientes</span>
                <div className="text-900 font-medium text-xl">28</div>
              </div>
              <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-home text-cyan-500 text-xl" />
              </div>
            </div>
            <span className="text-green-500 font-medium">5 </span>
            <span className="text-500">recém-registrado</span>
          </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
          <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Comentários</span>
                <div className="text-900 font-medium text-xl">152 não lido</div>
              </div>
              <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-comment text-purple-500 text-xl" />
              </div>
            </div>
            <span className="text-green-500 font-medium">85 </span>
            <span className="text-500">respondido</span>
          </div>
        </div>

      </div>

    </>
  )
}
