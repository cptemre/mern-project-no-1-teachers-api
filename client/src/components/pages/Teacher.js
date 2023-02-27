import React, { useContext, useState, useEffect } from "react";

// COMPONENTS
import WrongPage from "../../errors/WrongPage";
import NoData from "../../errors/NoData";
import Loading from "../loading/Loading";
import { Context } from "../../data/Context";

// NPMS
import $ from "jquery";
import { useSearchParams } from "react-router-dom";

// HOOKS
import useFetch from "../../hooks/useFetch";
import useLoad from "../../hooks/useLoad";
import useComponent from "../../hooks/useComponent";
import useNavbar from "../../hooks/useNavbar";

// FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

library.add(faChevronDown);

const Teacher = () => {
  // STATE
  const { state, dispatch } = useContext(Context);
  // IS LOAD
  const isLoad = useLoad();
  // COMPONENT
  const component = useComponent();
  // SHOULD I FETCH?
  const [isFetch, setIsFetch] = useState(true);
  // FETCH VARS
  const [fetchVars, setFetchVars] = useState({
    url: "",
    body: "",
    action: "",
    searchParams: "",
  });
  // SELECTED LESSON
  const [lesson, setLesson] = useState("");
  // QUERY
  const [searchParams, setSearchParams] = useSearchParams();
  // LESSON STUDENTS
  const [students, setStudents] = useState("");
  useEffect(() => {
    if (component) {
      setFetchVars({
        url: `${state.url.teachers}/${state.ID}`,
        body: "",
        action: "get",
        searchParams,
      });
    }
  }, [state.url, isFetch, component, state.ID]);

  // SET SELECTED BUTTON COLOR
  useNavbar(component, isLoad);

  const clickHandle = (e) => {
    const query = $(e.currentTarget)
      .siblings(".lessonName")
      .html()
      .replace(/ /g, "_");
    // SET QUERY
    setSearchParams((searchParams) => {
      searchParams.set("lesson", query);
      return searchParams;
    });
    // GET STUDENTS
    setFetchVars({
      url: state.url.students,
      body: "",
      action: "get",
      searchParams,
    });
  };

  // SET LESSON RELATED STUDENTS
  useEffect(() => {
    if (state.studentData) {
      const lessonStudents = state.studentData.map((student) => {
        if (student.lessons && student.lessons[lesson]) {
          return student;
        }
      });
      setStudents(lessonStudents);
    }
  }, [state.studentData]);
  console.log(state.students);

  // AXIOS CALL
  useFetch(
    fetchVars.url,
    fetchVars.body,
    fetchVars.action,
    fetchVars.searchParams,
    isFetch
  );
  return (
    <>
      {component !== "lessons" && component !== "account" ? (
        <WrongPage />
      ) : !state.teacherData && !isLoad ? (
        <Loading />
      ) : !state.teacherData ? (
        <NoData />
      ) : (
        <section
          id="lessonsSection"
          onClick={() => dispatch({ type: "IS_NAVBAR", payload: false })}
        >
          <article id="lessonContainer">
            {state.teacherData.branches ? (
              state.teacherData.branches.map((branch) => (
                <article className="lessons" key={branch}>
                  <div className="lessonDiv">
                    <div className="lessonName">{branch}</div>
                    <div
                      className="slideDown"
                      onMouseEnter={(e) =>
                        $(e.target).children().css("color", "white")
                      }
                      onMouseLeave={(e) =>
                        $(e.target).children().css("color", "black")
                      }
                      onClick={(e) => clickHandle(e)}
                    >
                      <FontAwesomeIcon
                        icon="fa-chevron-down"
                        className="icon downIcon"
                      />
                    </div>
                  </div>
                  <div className="studentsDiv">
                    <div id="addNewStudent"></div>
                    {students ? (
                      students.map((student, i) => (
                        <div key={i} className="studentsDiv">
                          {student}
                        </div>
                      ))
                    ) : (
                      <div id="addStudent"></div>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div>CONTACT WITH ADMIN TO ADD LESSONS</div>
            )}
          </article>
        </section>
      )}
    </>
  );
};

export default Teacher;