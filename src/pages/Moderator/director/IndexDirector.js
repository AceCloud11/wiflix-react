import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import UserContext from "../../../Context/UserContext";
import Pagination from "../../../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function IndexActor() {
  const data = useContext(UserContext);
  const toast = useToast();

  const [directors, setDirectors] = useState([]);
  const [director, setDirector] = useState("");
  const [directorId, setDirectorId] = useState("");
  const [directorNew, setDirectorNew] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
   const [search, setSearch] = useState("");

    const notify = (text) => toast.success(text);

  const fetchDirectors = async (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;
    await axios({
      url: "/directors?page=" + pg,
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Authorization: "Bearer " + this.state.token,
      },
    })
      .then(async (res) => {
        await setDirectors(res.data.data);
        await setLastPage(res.data.last_page);
        await setCurrentPage(res.data.current_page);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const searchDirectors = async (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;
    await axios({
      url: "/actors?search=" + search + "&page=" + pg,
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Authorization: "Bearer " + this.state.token,
      },
    })
      .then(async (res) => {
        await setDirectors(res.data.data);
        await setLastPage(res.data.last_page);
        await setCurrentPage(res.data.current_page);
      })
      .catch((err) => {
        console.error(err);
      });
  };

    const paginate = async (page) => {
      if (search === "") {
        await fetchDirectors(page);
      } else {
        await searchDirectors(page);
      }
    };
    

  const createDirector = async () => {
    axios({
      url: "/moderator/directors",
      method: "post",
      responseType: "json",
      data: {
        name: directorNew,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + data.token,
      },
    })
      .then(async (res) => {
          // console.log(res.data);
        await setDirectorNew("");
        onCloseCreate();
        fetchDirectors(1);
        toast({
          title: res.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
         toast({
           title: error.response.data.message,
           status: "error",
           duration: 3000,
           isClosable: true,
           position: "top-right",
         });
      });
  };

  const updateDirector = async () => {
    axios({
      url: "/moderator/directors/" + directorId,
      method: "put",
      responseType: "json",
      data: {
        name: director,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + data.token,
      },
    })
      .then(async (res) => {
        //   console.log(res.data);
        await setDirector("");
        await setDirectorId("");
        onCloseEdit();
        await fetchDirectors(1);
        toast({
          title: res.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        toast({
          title: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const deleteDirector = async (id) => {
    axios({
      url: "/moderator/directors/" + id,
      method: "delete",
      responseType: "json",
      data: {
        name: director,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + data.token,
      },
    })
      .then(async (res) => {
        //   console.log(res.data);
        await setDirectorId("");
        await fetchDirectors();
        toast({
          title: res.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
         toast({
           title: error.response.data.message,
           status: "error",
           duration: 3000,
           isClosable: true,
           position: "top-right",
         });
      });
  };

  useEffect(async () => {
    if (search === "") {
      await fetchDirectors(1);
    } else {
      await searchDirectors(1);
    }

    return () => {};
  }, [search]);

  // const { isOpenCreate, onOpenCreate, onCloseCreate } = useDisclosure();
  // const { isOpenEedit, onOpenEedit, onCloseEedit } = useDisclosure();
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="p-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-center text-xl font-bold hidden md:block">
            Directeurs
          </h1>

          <div className="space-x-4">
            <input
              type="text"
              placeholder="Nom ..."
              className="p-2 rounded-md border border-gray-300 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <button
              className="p-2 rounded-md bg-blue-500 text-white font-bold "
              onClick={() => searchDirectors(1)}
            >
              Recherche
            </button> */}
            </div>

          <button
            className="block px-4 py-2 rounded-md bg-indigo-600 text-white"
            onClick={onOpenCreate}
          >
            Ajouter un Directeur
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Nom du Directeur
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {directors.length
              ? directors.map((director) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={director.id}
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {director.name}
                    </th>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={() => {
                          setDirector(director.name);
                          setDirectorId(director.id);
                          onOpenEdit();
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={() => {
                          setDirectorId(director.id);
                          deleteDirector(director.id);
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>

          {lastPage > 1 ? (
            <tfoot>
              <tr>
                <th colSpan="4">
                  <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    handleClick={paginate}
                  />
                </th>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      <Modal isOpen={isOpenCreate} onClose={onCloseCreate}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Créer une nouvelle directeur</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <input
                type="text"
                value={directorNew}
                onChange={(e) => setDirectorNew(e.target.value)}
                placeholder="Nom"
                className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseCreate}>
              Fermer
            </Button>
            <Button colorScheme="teal" onClick={createDirector}>
              Créer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mettre à jour</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="Nom"
                className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseEdit}>
              Fermer
            </Button>
            <Button colorScheme="teal" onClick={updateDirector}>
              Modifier
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
