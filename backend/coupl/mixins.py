from django.shortcuts import redirect
from django.core.exceptions import ObjectDoesNotExist
from coupl.models import Event


# Login required


class UserGetMatchesMixin:
    def dispatch(self, request, *args, **kwargs):
        print(self.args, self.kwargs)
        print(request.data)
        if Event.objects.filter(pk=123123):
            return super().dispatch(request, *args, **kwargs)
        else:
            raise ObjectDoesNotExist
