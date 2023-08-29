from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db, required_admin, required_interviewer, required_applicant, get_current_user, required_team_management, required_system_lead
from database.schemas import interviews as schemas
from utils import interviews as utils


interview_router = APIRouter(
    prefix='/interviews',
    tags=['interviews']
)


@interview_router.post('')
async def create_interview(interview: schemas.InterviewCreate, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.create_interview(db=db, interview=interview)


@interview_router.get('')
async def get_interviews(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_interviews(db)


@interview_router.get('/id/{id}')
async def get_interview(id: str, user=Depends(required_applicant), db: Session = Depends(get_db)):
    db_interview = utils.get_interview(db, interview_id=id)
    if db_interview is None:
        raise HTTPException(
            status_code=404, detail="Interview not found")
    return db_interview


@interview_router.get('/team/{id}')
async def get_interviews_by_team(id: str, user=Depends(required_team_management), db: Session = Depends(get_db)):
    return utils.get_interviews_by_team(db, team_id=id)


@interview_router.get('/system/{id}')
async def get_interviews_by_system(id: str, user=Depends(required_system_lead), db: Session = Depends(get_db)):
    return utils.get_interviews_by_system(db, system_id=id)


@interview_router.get('/user/{id}')
async def get_interviews_by_user(id: str, user=Depends(required_applicant), db: Session = Depends(get_db)):
    return utils.get_interviews_by_user(db, user_id=id)


@interview_router.get('/user')
async def get_interviews_current_user(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return utils.get_interviews_by_user(db, user_id=user.id)


@interview_router.put('/{id}')
async def update_interview(id: str, interview: schemas.InterviewUpdate, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    db_interview = utils.update_interview(
        db=db, interview_id=id, interview=interview)
    if db_interview is None:
        raise HTTPException(
            status_code=404, detail="Interview not found")
    return db_interview


@interview_router.delete('/{id}')
async def delete_interview(id: str, user=Depends(required_admin), db: Session = Depends(get_db)):
    db_interview = utils.delete_interview(db=db, interview_id=id)
    if db_interview is None:
        raise HTTPException(
            status_code=404, detail="Interview not found")
    return db_interview


interview_note_router = APIRouter(
    prefix='/interview-notes',
    tags=['interview-notes']
)


@interview_note_router.post('')
async def create_interview_note(interview_note: schemas.InterviewNoteCreate, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    return utils.create_interview_note(
        db=db, interview_note=interview_note)


@interview_note_router.get('')
async def get_interview_notes(user=Depends(required_admin), db: Session = Depends(get_db)):
    return utils.get_interview_notes(db)


@interview_note_router.get('/id/{id}')
async def get_interview_note(id: str, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    db_interview_note = utils.get_interview_note(
        db, interview_note_id=id)
    if db_interview_note is None:
        raise HTTPException(
            status_code=404, detail="Interview note not found")
    return db_interview_note


@interview_note_router.get('/interview/{id}')
async def get_interview_notes_by_interview(id: str, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    return utils.get_interview_notes(db, interview_id=id)


@interview_note_router.put('/{id}')
async def update_interview_note(id: str, interview_note: schemas.InterviewNoteUpdate, user=Depends(required_interviewer), db: Session = Depends(get_db)):
    db_interview_note = utils.update_interview_note(
        db=db, interview_note_id=id, interview_note=interview_note)
    if db_interview_note is None:
        raise HTTPException(
            status_code=404, detail="Interview note not found")
    return db_interview_note


@interview_note_router.delete('/{id}')
async def delete_interview_note(id: str, user=Depends(required_admin), db: Session = Depends(get_db)):
    db_interview_note = utils.delete_interview_note(
        db=db, interview_note_id=id)
    if db_interview_note is None:
        raise HTTPException(
            status_code=404, detail="Interview note not found")
    return db_interview_note
