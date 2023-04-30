from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class AvailabilityBase(BaseModel):
    start_time: datetime
    end_time: datetime
    offset: int # Timezone offset (hours)


class AvailabilityCreate(AvailabilityBase):
    pass


class Availability(AvailabilityBase):
    id: int
    user_id: int


class AvailabilityUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    offset: Optional[int] = None
    user_id: Optional[int] = None
