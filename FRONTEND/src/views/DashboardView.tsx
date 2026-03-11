import { Fragment } from 'react'
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// @NOTE: Components
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
// @NOTE: Services
import { deleteProject, getProjects } from "@/services/ProjectAPI";
import { toast } from 'react-toastify';
// @NOTE: Types
import type { Project } from '../types';

export default function DashboardView() {

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["projects"], // @NOTE: El queryKey es un identificador único para esta consulta, se puede usar para invalidar la consulta o para acceder a los datos almacenados en caché
    queryFn: getProjects,
  });

  // @NOTE: Mutación para eliminar un proyecto
  const { mutate } = useMutation({
    mutationFn: (projectId: Project['_id']) => deleteProject(projectId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <h1 className="text-5xl font-black">Mis Proyectos</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">Maneja y administra tus proyectos</p>
      <nav className="my-5">
        <Link
          className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          to="/projects/create"
        >
          Nuevo Proyecto
        </Link>
      </nav>

      {data?.length ? (
        <ul role="list" className="space-y-4 divide-gray-100 border border-gray-100 mt-10">
          {data.map((project) => (
            <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10 bg-white shadow-sm">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                  <Link to={`/projects/${project._id}`}
                    className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                  >{project.projectName}</Link>
                  <p className="text-sm text-gray-400">
                    Cliente: {project.clientName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                  </MenuButton>
                  <Transition as={Fragment} enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <MenuItems
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                    >
                      <MenuItem>
                        <Link to={`/projects/${project._id}`}
                          className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                          Ver Proyecto
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to={`/projects/${project._id}/edit`}
                          className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                          Editar Proyecto
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          type='button'
                          className='block px-3 py-1 text-sm leading-6 text-red-500'
                          onClick={() => mutate(project._id)}
                        >
                          Eliminar Proyecto
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-20">
          No hay proyectos aún {''}
          <Link
            to="/projects/create"
            className="text-fuchsia-500 font-bold"
          >
            Crear Proyecto
          </Link>
        </p>
      )}

    </>
  )
}
